import Link from "next/link"

export function Footer() {
  return (
    <footer className="my-24 container">
      <div className="w-full mx-auto text-center">
        <p className="text-sm font-semibold">
          Made with 💙 by{" "}
          <a className="underline" target="_blank" href="https://astroom.dev/">
            astroom
          </a>
        </p>

        <p className="text-sm">© Buddleja Corporation. {new Date().getFullYear()}. All rights reserved.</p>

        <ul className="mt-2 flex gap-2 justify-center">
          <li className="text-sm text-blue-500">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
