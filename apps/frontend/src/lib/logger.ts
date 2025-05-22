type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off'

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    context?: Record<string, unknown>
}

class Logger {
    private level: LogLevel
    private levels: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        off: 4,
    }

    constructor() {
        this.level = (process.env.LOG_LEVEL as LogLevel) || 'info'
    }

    private shouldLog(level: LogLevel): boolean {
        return this.levels[level] >= this.levels[this.level]
    }

    private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        }
    }

    private output(logEntry: LogEntry): void {
        if (typeof window !== 'undefined') {
            // Browser environment
            const method = logEntry.level === 'error' ? 'error' :
                logEntry.level === 'warn' ? 'warn' : 'log'
            console[method](JSON.stringify(logEntry, null, 2))
        } else {
            // Node.js environment
            console.log(JSON.stringify(logEntry))
        }
    }

    debug(message: string, context?: Record<string, unknown>): void {
        if (this.shouldLog('debug')) {
            this.output(this.formatLog('debug', message, context))
        }
    }

    info(message: string, context?: Record<string, unknown>): void {
        if (this.shouldLog('info')) {
            this.output(this.formatLog('info', message, context))
        }
    }

    warn(message: string, context?: Record<string, unknown>): void {
        if (this.shouldLog('warn')) {
            this.output(this.formatLog('warn', message, context))
        }
    }

    error(message: string, context?: Record<string, unknown>): void {
        if (this.shouldLog('error')) {
            this.output(this.formatLog('error', message, context))
        }
    }

    // Theme-specific logging methods
    themeChange(from: string, to: string): void {
        this.info('Theme changed', { from, to, type: 'theme_change' })
    }

    componentMount(componentName: string, props?: Record<string, unknown>): void {
        this.debug('Component mounted', { componentName, props, type: 'component_lifecycle' })
    }

    componentUnmount(componentName: string): void {
        this.debug('Component unmounted', { componentName, type: 'component_lifecycle' })
    }

    performance(operation: string, duration: number): void {
        this.info('Performance metric', { operation, duration, type: 'performance' })
    }
}

export const logger = new Logger()
export type { LogLevel, LogEntry } 