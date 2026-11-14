import { useId } from "react"
import { Form, Link, useActionData, useNavigation } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Log in page. Shown by the router at /login.
 *
 * The form is a React Router <Form>: submitting it calls this route's `action`
 * (in App.jsx), which sends the request to the backend. If the action returns
 * { error }, the message is shown under the form.
 */
export default function LoginScreen() {
  const id = useId()
  const actionData = useActionData()
  const error = actionData?.error
  const pending = useNavigation().state === "submitting"

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="mx-auto w-full max-w-6xl px-6 py-5 sm:px-10">
        <Link to="/" className="text-base font-semibold tracking-tight">
          Class Social
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl leading-none font-bold tracking-[-0.03em]">Log in</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-foreground underline underline-offset-4">
              Sign up
            </Link>
          </p>

          <Form method="post" className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                required
                name="email"
                className="h-10 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                type="password"
                autoComplete="current-password"
                required
                name="password"
                className="h-10 text-sm"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={pending} className="mt-1 h-11 text-sm">
              {pending ? "Logging in…" : "Log in"}
            </Button>
          </Form>
        </div>
      </section>
    </main>
  )
}