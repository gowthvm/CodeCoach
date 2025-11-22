/**
 * Model Manager - Handles automatic fallback between AI models
 * 
 * This module provides resilient AI model rotation to handle rate limits
 * and availability issues with OpenRouter free models.
 */

import { fetchWithKeyRotation } from './api-key-manager';

// Priority-ordered list of working free models
// Based on testing: Mistral > Hermes > Llama
const MODEL_PRIORITY = [
    'mistralai/mistral-7b-instruct:free',        // Best - no rate limits in testing
    'nousresearch/hermes-3-llama-3.1-405b:free', // Good - daily limit
    'meta-llama/llama-3.2-3b-instruct:free',     // OK - rate limited
    'google/gemini-2.0-flash-exp:free',          // Fast but aggressive rate limits
];

interface ModelState {
    model: string;
    failedAt: number | null;
    failureCount: number;
}

class ModelManager {
    private models: ModelState[];
    private currentIndex: number;
    private readonly FAILURE_COOLDOWN = 60000; // 1 minute cooldown after failure

    constructor() {
        this.models = MODEL_PRIORITY.map(model => ({
            model,
            failedAt: null,
            failureCount: 0,
        }));
        this.currentIndex = 0;
    }

    /**
     * Get the current model to try
     */
    getCurrentModel(): string {
        return this.models[this.currentIndex].model;
    }

    /**
     * Get next available model (skips recently failed ones)
     */
    getNextModel(): string | null {
        const now = Date.now();

        // Try to find a model that hasn't recently failed
        for (let i = 0; i < this.models.length; i++) {
            const model = this.models[i];

            // Check if model is available (not in cooldown)
            if (!model.failedAt || (now - model.failedAt) > this.FAILURE_COOLDOWN) {
                this.currentIndex = i;
                return model.model;
            }
        }

        // If all models are in cooldown, reset and try again
        this.resetAllFailures();
        this.currentIndex = 0;
        return this.models[0].model;
    }

    /**
     * Mark current model as failed
     */
    markCurrentAsFailed(): void {
        const model = this.models[this.currentIndex];
        model.failedAt = Date.now();
        model.failureCount++;

        console.log(`[Model Manager] Model failed: ${model.model} (${model.failureCount} failures)`);
    }

    /**
     * Move to next model in rotation
     */
    rotateToNext(): boolean {
        this.currentIndex = (this.currentIndex + 1) % this.models.length;
        return this.currentIndex !== 0; // Return false if we've cycled through all
    }

    /**
     * Reset all failure states
     */
    resetAllFailures(): void {
        this.models.forEach(model => {
            model.failedAt = null;
            model.failureCount = 0;
        });
        console.log('[Model Manager] Reset all model failure states');
    }

    /**
     * Get all available models
     */
    getAllModels(): string[] {
        return this.models.map(m => m.model);
    }
}

// Singleton instance
let modelManager: ModelManager | null = null;

/**
 * Get or create the model manager instance
 */
function getModelManager(): ModelManager {
    if (!modelManager) {
        modelManager = new ModelManager();
    }
    return modelManager;
}

/**
 * Main function: Fetch with automatic model fallback
 * 
 * This wraps fetchWithKeyRotation and adds model rotation on top.
 * It will try each model in priority order until one succeeds.
 * 
 * @param url - OpenRouter API endpoint
 * @param requestBody - The request body (should include messages, but NOT model)
 * @param options - Additional fetch options
 * @returns Promise<Response> - Successful response from whichever model worked
 */
export async function fetchWithModelFallback(
    url: string,
    requestBody: any,
    options: RequestInit = {}
): Promise<{ response: Response; modelUsed: string }> {
    const manager = getModelManager();
    const maxAttempts = manager.getAllModels().length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const currentModel = manager.getNextModel();

        if (!currentModel) {
            console.error('[Model Manager] No models available');
            break;
        }

        console.log(`[Model Manager] Attempting with model: ${currentModel} (attempt ${attempt + 1}/${maxAttempts})`);

        try {
            // Add model to request body
            const bodyWithModel = {
                ...requestBody,
                model: currentModel,
            };

            // Use existing key rotation for this model
            const response = await fetchWithKeyRotation(url, {
                ...options,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                body: JSON.stringify(bodyWithModel),
            });

            // Check if response is successful
            if (response.ok) {
                console.log(`[Model Manager] ✓ Success with model: ${currentModel}`);
                return { response, modelUsed: currentModel };
            }

            // Handle different error types
            if (response.status === 429) {
                console.log(`[Model Manager] ✗ Rate limited on model: ${currentModel}`);
                manager.markCurrentAsFailed();
                manager.rotateToNext();
                continue;
            }

            if (response.status === 404) {
                console.log(`[Model Manager] ✗ Model not found (404): ${currentModel}`);
                manager.markCurrentAsFailed();
                manager.rotateToNext();
                continue;
            }

            if (response.status >= 500) {
                console.log(`[Model Manager] ✗ Server error (${response.status}) on model: ${currentModel}`);
                manager.markCurrentAsFailed();
                manager.rotateToNext();
                continue;
            }

            // For other 4xx errors, don't rotate - it's likely a request issue
            console.error(`[Model Manager] Request error (${response.status}) on model: ${currentModel}`);
            return { response, modelUsed: currentModel };

        } catch (error) {
            console.error(`[Model Manager] Exception with model ${currentModel}:`, error);
            lastError = error instanceof Error ? error : new Error(String(error));
            manager.markCurrentAsFailed();
            manager.rotateToNext();
        }
    }

    // All models failed
    throw lastError || new Error('All AI models failed or are rate-limited. Please try again in a moment.');
}

/**
 * Export the manager getter for testing/debugging
 */
export { getModelManager };
