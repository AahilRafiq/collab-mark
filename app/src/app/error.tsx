"use client"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bug , ArrowLeft } from "lucide-react"

export default function Component() {
  return (
    <main className="h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-xl mx-auto text-center p-8 space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <Bug className="w-12 h-12 mx-auto text-red-500" />
        <CardHeader className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          Oops, Something Went Wrong
        </CardHeader>
        <CardContent className="text-gray-600 dark:text-gray-400">
          There was an error processing your request. Please try again.
        </CardContent>
        <Button className="mx-auto" variant="outline">
          <Link
            className="inline-flex items-center justify-center rounded-md px-8 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400"
            href="/"
          >
            Return Home
            <ArrowLeft className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Card>
    </main>
  )
}