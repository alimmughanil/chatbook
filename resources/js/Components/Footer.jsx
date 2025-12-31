import { usePage } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";

const Footer = () => {
  const { footer } = usePage().props

  return (
    <footer
      className="flex linear-gradient-purple justify-center w-full sm:mt-[48px] mt-[28px]"
    >
      <div
        className="flex flex-col mx-auto sm:px-[100px] px-[16px] w-full sm:justify-center sm:items-center sm:my-[30px] my-[20px] max-w-[1380px]"
      >
        <div
          className="flex lg:flex-row flex-col justify-center items-center w-full"
        >
          <ApplicationLogo />
        </div>
        <hr
          className="w-full lg:my-[32px] my-[24px]"
          style={{ border: '1px solid rgba(255, 255, 255, 0.25)' }}
        />
        <ul
          className="flex flex-wrap w-full justify-center sm:text-sm text-[8px] text-white"
        >
          <li className="font-normal sm:pr-[16px] pr-[8px]">
            <a href="/app/about">Tentang</a>
          </li>
          <li className="font-normal sm:px-[16px] px-[8px]">
            <a href="/app/contact">Kontak</a>
          </li>
          <li className="font-normal sm:px-[16px] px-[8px]">
            <a href="/app/blog">Blog</a>
          </li>
          <li className="font-normal sm:px-[16px] px-[8px]">
            <a href="/app/disclaimer">Disclaimer</a>
          </li>
          <li className="font-normal sm:px-[16px] px-[8px]">
            <a href="/app/privacy">Privacy Policy</a>
          </li>
          {!!footer?.telegram_group ? (
            <li className="font-normal sm:pl-[16px] pl-[8px]">
              <a href={footer?.telegram_group}>Telegram Group</a>
            </li>
          ) : null}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
