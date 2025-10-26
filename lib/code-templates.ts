export interface CodeTemplate {
  id: string
  name: string
  language: string
  description: string
  code: string
}

export const codeTemplates: CodeTemplate[] = [
  {
    id: "js-function",
    name: "JavaScript Function",
    language: "javascript",
    description: "Basic function example",
    code: `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log(result);`
  },
  {
    id: "py-class",
    name: "Python Class",
    language: "python",
    description: "Simple class with methods",
    code: `class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, x, y):
        self.result = x + y
        return self.result
    
    def get_result(self):
        return self.result

calc = Calculator()
print(calc.add(10, 5))`
  },
  {
    id: "ts-interface",
    name: "TypeScript Interface",
    language: "typescript",
    description: "Interface and implementation",
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

console.log(greetUser(user));`
  },
  {
    id: "java-class",
    name: "Java Class",
    language: "java",
    description: "Basic Java class",
    code: `public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    public static void main(String[] args) {
        Person person = new Person("Alice", 30);
        System.out.println(person.getName());
    }
}`
  },
  {
    id: "cpp-template",
    name: "C++ Template",
    language: "cpp",
    description: "Template function example",
    code: `#include <iostream>
#include <vector>

template<typename T>
T findMax(const std::vector<T>& arr) {
    T max = arr[0];
    for (const T& val : arr) {
        if (val > max) {
            max = val;
        }
    }
    return max;
}

int main() {
    std::vector<int> numbers = {3, 7, 2, 9, 1};
    std::cout << "Max: " << findMax(numbers) << std::endl;
    return 0;
}`
  },
  {
    id: "go-struct",
    name: "Go Struct",
    language: "go",
    description: "Struct with methods",
    code: `package main

import "fmt"

type Rectangle struct {
    width  float64
    height float64
}

func (r Rectangle) Area() float64 {
    return r.width * r.height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.width + r.height)
}

func main() {
    rect := Rectangle{width: 10, height: 5}
    fmt.Printf("Area: %.2f\\n", rect.Area())
    fmt.Printf("Perimeter: %.2f\\n", rect.Perimeter())
}`
  },
  {
    id: "rust-enum",
    name: "Rust Enum",
    language: "rust",
    description: "Enum with pattern matching",
    code: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(radius) => std::f64::consts::PI * radius * radius,
            Shape::Rectangle(width, height) => width * height,
            Shape::Triangle(a, b, c) => {
                let s = (a + b + c) / 2.0;
                (s * (s - a) * (s - b) * (s - c)).sqrt()
            }
        }
    }
}

fn main() {
    let circle = Shape::Circle(5.0);
    println!("Circle area: {}", circle.area());
}`
  },
  {
    id: "php-class",
    name: "PHP Class",
    language: "php",
    description: "PHP class example",
    code: `<?php
class Product {
    private $name;
    private $price;
    
    public function __construct($name, $price) {
        $this->name = $name;
        $this->price = $price;
    }
    
    public function getPrice() {
        return $this->price;
    }
    
    public function applyDiscount($percentage) {
        $this->price -= $this->price * ($percentage / 100);
    }
}

$product = new Product("Laptop", 1000);
$product->applyDiscount(10);
echo "Price: $" . $product->getPrice();
?>`
  },
  {
    id: "ruby-module",
    name: "Ruby Module",
    language: "ruby",
    description: "Ruby module and class",
    code: `module Greetable
  def greet
    "Hello, #{@name}!"
  end
end

class Person
  include Greetable
  
  attr_accessor :name, :age
  
  def initialize(name, age)
    @name = name
    @age = age
  end
  
  def introduce
    "I'm #{@name}, #{@age} years old."
  end
end

person = Person.new("Bob", 25)
puts person.greet
puts person.introduce`
  },
  {
    id: "csharp-linq",
    name: "C# LINQ",
    language: "csharp",
    description: "LINQ query example",
    code: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        var evenNumbers = numbers
            .Where(n => n % 2 == 0)
            .Select(n => n * n)
            .ToList();
        
        Console.WriteLine("Even numbers squared:");
        evenNumbers.ForEach(n => Console.WriteLine(n));
    }
}`
  }
]

export function getTemplatesByLanguage(language: string): CodeTemplate[] {
  return codeTemplates.filter(t => t.language === language)
}

export function getTemplateById(id: string): CodeTemplate | undefined {
  return codeTemplates.find(t => t.id === id)
}
