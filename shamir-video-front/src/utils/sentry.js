import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const DSN = import.meta.env.VITE_SENTRY_DSN

export function initSentry(app, router) {
    Sentry.init({
        app,
        dsn: DSN,
        integrations: [
            new Integrations.BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: ['localhost', 'shamir-video.com', /^\//],
            }),
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    })
}
