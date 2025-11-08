import { RssIcon } from "lucide-react";
import websiteIcon from "../assets/icons/website-icon.svg";
import githubIcon from "../assets/icons/github-icon.svg";

function Footer() {
  return (
    <footer className="bg-slate-900 px-10 pt-16 pb-10">
      <div className="flex justify-between flex-col md:flex-row">
        <div>
          <p className="text-white font-semibold flex items-center gap-1">
            <RssIcon />
            <span>News RSS</span>
          </p>
          <p className="text-slate-300 max-w-[30ch] mt-6">
            News RSS is a news feed reader, powered by RSS, to deliver the
            lastest news articles to you.{" "}
          </p>
          <p className="text-slate-300 mt-8">Jon Monarrez &copy; 2024</p>
        </div>
        <div className="text-white mt-8 md:mt-0 flex items-center gap-4 md:items-start">
          <a
            href={window.location.href}
            target="_blank"
            className="hover:scale-110 transition-all duration-300"
          >
            <img
              src={websiteIcon}
              className="size-6 text-white"
              role="presentation"
              alt="Jon's Website"
            />
          </a>
          <a
            href="https://github.com/j0n-m/news-frontend"
            target="_blank"
            className="hover:scale-110 transition-all duration-300"
          >
            <img
              src={githubIcon}
              className="size-6"
              role="presentation"
              alt="Jon's Github"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
