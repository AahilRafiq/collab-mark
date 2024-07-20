import Image from "next/image"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-4 md:py-8 lg:py-12 xl:py-36">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Collaborative Markdown Editing
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CollabMark is a real-time collaborative markdown editor that allows you and your team to work
                    together seamlessly on your projects.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/home/0"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Try CollabMark
                  </Link>
                </div>
              </div>
              <Image
                src="/cover_image.svg"
                width="650"
                height="450"
                alt="Hero"
                className="mx-auto "
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Collaborative Editing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Work Together in Real-Time</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CollabMark allows you and your team to edit markdown files together in real-time, with changes synced
                  instantly across all users.
                </p>
              </div>
            </div>
            <div className="mx-auto flex flex-row flex-wrap max-w-6xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/editor_cover.png"
                width="600"
                height="400"
                alt="Image"
                unoptimized
                className="mx-auto max-w-[700px] rounded-md object-cover object-center sm:w-full lg:order-last w-full"
              />
              <div className="flex flex-col max-w-[25rem] justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Simultaneous Editing</h3>
                      <p className="text-muted-foreground">
                        Multiple users can edit the same markdown file at the same time, with changes synced instantly.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1" />
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Conflict Resolution</h3>
                      <p className="text-muted-foreground">
                        CollabMark automatically resolves conflicts when multiple users edit the same content.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Markdown Organization</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Organize Your Markdown Files</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CollabMark allows you to create and manage folders to organize your markdown files, making it easy to
                  keep your projects structured and accessible.
                </p>
              </div>
            </div>
            <div className="mx-auto flex flex-row flex-wrap max-w-6xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <Image
                src="/files_cover.png"
                width="600"
                height="400"
                alt="Image"
                unoptimized
                className="mx-auto max-w-[700px] rounded-md object-cover object-center sm:w-full lg:order-last w-full"
              />
              <div className="flex max-w-96 flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Folder Management</h3>
                      <p className="text-muted-foreground">
                        Create, rename, and delete folders to keep your markdown files organized.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Nested Folders</h3>
                      <p className="text-muted-foreground">
                        Organize your files even further with the ability to create nested folders.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Shared Folders</h3>
                      <p className="text-muted-foreground">Share folders with your team to collaborate on projects.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CollabMark. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}