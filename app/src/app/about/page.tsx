import Link from 'next/link';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About This Project</h1>
      <p className="mb-4">
        This is a side project created for fun.</p>
      <p className="mb-4">
        You can find more information about the project and me at the following links:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <Link href="https://github.com/AahilRafiq" className="text-blue-500 hover:underline">
            My GitHub Profile
          </Link>
        </li>
        <li>
          <Link href="https://github.com/AahilRafiq/collab-mark" className="text-blue-500 hover:underline">
            Project Repository
          </Link>
        </li>
      </ul>
      <p>
        Feel free to explore the code, or reach out if you have any questions or suggestions!
      </p>
    </div>
  );
}