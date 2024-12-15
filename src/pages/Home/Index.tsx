import { Button } from "@/components/ui/button";
import Nav from "../../components/NavigationBar/Nav";
import feedSrc from "../../assets/images/feed-sources.png";
import website from "../../assets/images/website.png";
import favorites from "../../assets/images/favorites.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Footer from "@/components/Footer";

function Index() {
  return (
    <>
      <Nav />
      <div id="index" className="max-w-[1300px] mx-auto">
        <div className="min-h-svh">
          <main className="px-4">
            <div className="hero pt-24 pb-20 flex flex-col items-center justify-center">
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-5xl font-semibold text-center lg:text-6xl">
                  Create your own news feed
                </h1>
                <p className="text-2xl opacity-65 text-center lg:text-3xl mt-8">
                  Follow the news and articles that you care about
                </p>
              </div>
              <div className="flex justify-center mt-10">
                <Button
                  variant={"blue"}
                  className="py-6 px-8 text-lg hover:scale-105 transition-all duration-300"
                >
                  Get started for free
                </Button>
              </div>
            </div>
            <div className="mt-6 flex justify-center items-center">
              <img src={website} alt="main website" className="rounded-lg" />
            </div>

            <div className="discover py-24">
              <div className="flex flex-col justify-center items-center lg:flex-row">
                <div className="">
                  <h2 className="text-4xl font-semibold text-center mb-6 max-w-[30ch] mx-auto">
                    Discover and subscribe to your favorite articles
                  </h2>
                  <p className="text-2xl opacity-65 text-center lg:text-3xl max-w-[30ch] mx-auto">
                    Follow the topics and sources that your only interested in.
                  </p>
                </div>
                <img
                  src={feedSrc}
                  className="md:max-w-[400px]"
                  alt="icons of many website sources"
                />
              </div>
            </div>

            <div className="save-articles py-24">
              <div className="flex flex-col justify-center items-center gap-10 lg:flex-row">
                <div className="">
                  <h2 className="text-4xl font-semibold text-center max-w-[30ch] mx-auto">
                    Save your articles for later
                  </h2>
                  <p className="text-2xl opacity-65 text-center lg:text-3xl max-w-[30ch] mx-auto mt-6">
                    In a time crunch and cannot read your article? No worries!
                    Save and read it later.
                  </p>
                </div>
                <img
                  src={favorites}
                  alt="screenshot"
                  className="-order-1 md:max-w-[400px]"
                />
              </div>
            </div>

            <div className="testimonials py-24">
              <div className="flex flex-col justify-center items-center gap-10">
                <h2 className="text-4xl font-semibold text-center">
                  Loved by millions of readers
                </h2>

                <div className="testimonial-card flex flex-col justify-center gap-4 items-center lg:flex-row mt-6">
                  <Avatar className="size-12">
                    <AvatarFallback className="">JF</AvatarFallback>
                  </Avatar>

                  <div className="testimonial-content text-center lg:text-start lg:max-w-[525px]">
                    <p className="t-title text-xl font-semibold">
                      Jake Farms, The Readers Group
                    </p>
                    <p className="t-comment mt-2 opacity-60">
                      I love how I can access all my news in one place with News
                      RSS. I strongly recommend it.
                    </p>
                  </div>
                </div>
                <div className="testimonial-card flex flex-col justify-center gap-4 items-center lg:flex-row">
                  <Avatar className="size-12">
                    <AvatarFallback className="">LD</AvatarFallback>
                  </Avatar>
                  <div className="testimonial-content text-center lg:text-start lg:max-w-[525px]">
                    <p className="t-title text-xl font-semibold">
                      Luke Duke, Race car Magazine
                    </p>
                    <p className="t-comment mt-2 opacity-60">
                      News RSS is easy to use and not sure how I haven't
                      discovered this sooner!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Index;
