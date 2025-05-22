/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

describe('ThemeProvider Integration', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
      themes: ['light', 'dark'],
      systemTheme: 'light',
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render children within theme provider context', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div data-testid="test-child">Test Content</div>
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should pass through theme provider props correctly', () => {
    const TestComponent = () => {
      const { theme } = useTheme()
      return <div data-testid="theme-display">{theme}</div>
    }

    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <TestComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-display')).toHaveTextContent('light')
  })

  it('should handle theme switching', () => {
    const setThemeMock = jest.fn()
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
      resolvedTheme: 'dark',
      themes: ['light', 'dark'],
      systemTheme: 'light',
    })

    const TestComponent = () => {
      const { theme, setTheme } = useTheme()
      return (
        <div>
          <div data-testid="current-theme">{theme}</div>
          <button
            type="button"
            onClick={() => setTheme('light')}
            data-testid="theme-toggle"
          >
            Switch to Light
          </button>
        </div>
      )
    }

    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')

    const toggleButton = screen.getByTestId('theme-toggle')
    toggleButton.click()

    expect(setThemeMock).toHaveBeenCalledWith('light')
  })

  it('should support different theme attributes', () => {
    render(
      <ThemeProvider attribute="data-theme" defaultTheme="light">
        <div data-testid="test-content">Content</div>
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
  })

  it('should handle system theme detection when enabled', () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'dark',
    })

    const TestComponent = () => {
      const { theme, systemTheme, resolvedTheme } = useTheme()
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <div data-testid="system-theme">{systemTheme}</div>
          <div data-testid="resolved-theme">{resolvedTheme}</div>
        </div>
      )
    }

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TestComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
  })
})
