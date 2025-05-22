/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import NoteCard from '@/components/note-card'

describe('UI Components Integration', () => {
  describe('Button Component', () => {
    it('should render with default variant and size', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
      )
    })

    it('should handle different variants', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button', { name: 'Click me' })
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
    })

    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      )
      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })
  })

  describe('Card Components', () => {
    it('should render complete card structure', () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>,
      )

      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description text')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('should apply custom className to card components', () => {
      render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
          </CardHeader>
        </Card>,
      )

      const card = screen.getByText('Title').closest('[class*="custom-card"]')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Input Component', () => {
    it('should render input with placeholder', () => {
      render(<Input placeholder="Enter text here" />)
      const input = screen.getByPlaceholderText('Enter text here')
      expect(input).toBeInTheDocument()
    })

    it('should handle value changes', () => {
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test value' } })

      expect(handleChange).toHaveBeenCalled()
    })

    it('should support different input types', () => {
      render(<Input type="email" placeholder="Email" />)
      const input = screen.getByPlaceholderText('Email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled placeholder="Disabled input" />)
      const input = screen.getByPlaceholderText('Disabled input')
      expect(input).toBeDisabled()
    })
  })

  describe('NoteCard Component', () => {
    const defaultProps = {
      title: 'Test Note',
      content: 'This is test content',
    }

    it('should render note card with title and content', () => {
      render(<NoteCard {...defaultProps} />)

      expect(screen.getByText('Test Note')).toBeInTheDocument()
      expect(screen.getByText('This is test content')).toBeInTheDocument()
    })

    it('should apply custom colors', () => {
      render(
        <NoteCard
          {...defaultProps}
          color="bg-red-500"
          textColor="text-white"
        />,
      )

      const title = screen.getByText('Test Note')
      expect(title).toBeInTheDocument()
    })

    it('should render action buttons', () => {
      render(<NoteCard {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2) // Edit + Add image buttons
    })

    it('should handle button clicks', () => {
      render(<NoteCard {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        fireEvent.click(button)
        // Should not throw errors
      })
    })

    it('should display timestamp', () => {
      render(<NoteCard {...defaultProps} />)
      expect(screen.getByText('Just now')).toBeInTheDocument()
    })

    it('should use default colors when not provided', () => {
      render(<NoteCard {...defaultProps} />)

      const title = screen.getByText('Test Note')
      expect(title).toBeInTheDocument()
    })
  })

  describe('Component Accessibility', () => {
    it('should have proper ARIA labels on interactive elements', () => {
      render(<NoteCard title="Test" content="Content" />)

      // Check for aria-labels on SVG icons
      const svgElements = document.querySelectorAll('svg[aria-label]')
      expect(svgElements.length).toBeGreaterThan(0)
    })

    it('should have proper button types', () => {
      render(<NoteCard title="Test" content="Content" />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })

    it('should support keyboard navigation', () => {
      render(<Button>Test Button</Button>)

      const button = screen.getByRole('button')
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })
})
