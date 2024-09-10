import { Hero } from "./Hero"
import { Navbar } from "./Navbar"
import { HomeFaq } from "./HomeFaq"
import { LearnMore } from "./LearnMore"

export default function Home() {
  // await getServerSession(authOptions);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="pt-32 pb-12">
          <Hero />
          <LearnMore />
        </div>
        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h2>
          <HomeFaq />
        </div>

        <script src="./scripts/popup-client.js" data-site-id="b80b7d4e-76a9-4267-a885-eaca07805eda" data-api-url="http://localhost:3456/api/external/sites" defer></script>
      </div>
    </>
  )
}
