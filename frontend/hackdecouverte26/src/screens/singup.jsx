import { useId } from "react"
import { Form, Link, useActionData, useNavigation } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MIN_PASSWORD = 8

/**
 * Sign up page. Shown by the router at /signup.
 *
 * The form is a React Router <Form>: submitting it calls this route's `action`
 * (in App.jsx), which sends the request to the backend. If the action returns
 * { error }, the message is shown under the form.
 */
export default function SignupScreen() {
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
          <h1 className="text-4xl leading-none font-bold tracking-[-0.03em]">Create your account</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Already have one?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>

          <Form method="post" className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-name`}>Full name</Label>
              <Input
                id={`${id}-name`}
                autoComplete="name"
                required
                name="fullName"
                className="h-10 text-sm"
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD}
                aria-describedby={`${id}-password-hint`}
                name="password"
                className="h-10 text-sm"
              />
              <p id={`${id}-password-hint`} className="text-xs text-muted-foreground">
                At least {MIN_PASSWORD} characters.
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={pending} className="mt-1 h-11 text-sm">
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </Form>
        </div>
      </section>
    </main>
  )
}