"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { codeTemplates } from "@/lib/code-templates"

interface DashboardDialogsProps {
  showTemplates: boolean
  setShowTemplates: (show: boolean) => void
  showKeyboardShortcuts: boolean
  setShowKeyboardShortcuts: (show: boolean) => void
  showClearConfirm: boolean
  setShowClearConfirm: (show: boolean) => void
  onTemplateSelect: (templateId: string) => void
  onClear: () => void
}

export function DashboardDialogs({
  showTemplates,
  setShowTemplates,
  showKeyboardShortcuts,
  setShowKeyboardShortcuts,
  showClearConfirm,
  setShowClearConfirm,
  onTemplateSelect,
  onClear,
}: DashboardDialogsProps) {
  return (
    <>
      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Code Templates</DialogTitle>
            <DialogDescription>
              Select a template to quickly start coding
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {codeTemplates.map((template) => (
              <Card 
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onTemplateSelect(template.id)}
              >
                <CardHeader>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs bg-muted p-2 rounded font-mono overflow-hidden">
                    {template.code.substring(0, 100)}...
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Speed up your workflow with these shortcuts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Analyze/Convert Code</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl/Cmd + Enter</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Clear All</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl/Cmd + K</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Show Templates</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl/Cmd + T</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Show Shortcuts</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl/Cmd + /</kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Code?</DialogTitle>
            <DialogDescription>
              This will clear both input and output code. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onClear}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
