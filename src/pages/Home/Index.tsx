import { Button } from "@/components/ui/button";
import Nav from "../../components/NavigationBar/Nav";
import feedSrc from "../../assets/images/feed-sources.png";
import website from "../../assets/images/website.png";
import favorites from "../../assets/images/favorites.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/components/Footer";
import f1 from "../../assets/images/f1.png";
import f2 from "../../assets/images/f2.png";
import f3 from "../../assets/images/f3.png";
import { Link } from "@tanstack/react-router";

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
                  asChild
                >
                  <Link to="/signup">Get started for free</Link>
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
                  className="md:-order-1 md:max-w-[400px]"
                />
              </div>
            </div>

            <div className="testimonials py-24">
              <div className="flex flex-col justify-center items-center gap-14">
                <h2 className="text-4xl font-semibold text-center mb-4">
                  Loved by millions of readers
                </h2>

                <div className="testimonial-card flex flex-col justify-center gap-4 items-center lg:flex-row">
                  <Avatar className="size-20 lg:size-16">
                    <AvatarImage
                      src={f3}
                      className="object-cover"
                    ></AvatarImage>
                    <AvatarFallback className="">A</AvatarFallback>
                  </Avatar>
                  <div className="testimonial-content text-center lg:text-start lg:max-w-[525px]">
                    <p className="t-title text-xl font-semibold">
                      Anna James, National Readers Association
                    </p>
                    <p className="t-comment mt-2 opacity-60">
                      News RSS keeps me updated on the lastest news and easy to
                      use, the best of both worlds!
                    </p>
                  </div>
                </div>

                <div className="testimonial-card flex flex-col justify-center gap-4 items-center lg:flex-row">
                  <Avatar className="size-20 lg:size-16">
                    <AvatarImage
                      src={f1}
                      className="object-cover"
                    ></AvatarImage>
                    <AvatarFallback className="">JF</AvatarFallback>
                  </Avatar>

                  <div className="testimonial-content text-center lg:text-start lg:max-w-[525px]">
                    <p className="t-title text-xl font-semibold">
                      Jake Farms, Reader's Lounge
                    </p>
                    <p className="t-comment mt-2 opacity-60">
                      I love how I can access all my news in one place with News
                      RSS. I strongly recommend it.
                    </p>
                  </div>
                </div>

                <div className="testimonial-card flex flex-col justify-center gap-4 items-center lg:flex-row">
                  <Avatar className="size-20 lg:size-16">
                    <AvatarImage
                      src={f2}
                      className="object-cover"
                    ></AvatarImage>
                    <AvatarFallback className="">LD</AvatarFallback>
                  </Avatar>
                  <div className="testimonial-content text-center lg:text-start lg:max-w-[525px]">
                    <p className="t-title text-xl font-semibold">
                      Luke Duke, News Paper Weekly
                    </p>
                    <p className="t-comment mt-2 opacity-60">
                      News RSS is simple, yet impressive news aggregator app
                      that's tailored to us. Wish I found this sooner.
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
