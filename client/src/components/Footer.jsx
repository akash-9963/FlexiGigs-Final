import Link from "next/link";
import React from "react";
import {
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import FiverrLogo from "./FiverrLogo";
import { categories } from "../utils/categories";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <FiGithub />, link: "https://github.com/akash-9963" },
    {
      name: "Youtube",
      icon: <FiYoutube />,
      link: "https://www.youtube.com/@akashdangudubiyyapu1614",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      link: "https://www.linkedin.com/in/dangudubiyyapu-akash-3871ab272/",
    },
    {
      name: "Instagram",
      icon: <FiInstagram />,
      link: "https://www.instagram.com/akash__9963/?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D",
    },
    {
      name: "Twitter",
      icon: <FiTwitter />,
      link: "https://twitter.com",
    },
  ];

  const data = [
    {
      headerName: "Categories",
      links: [
        ...categories.map(({ name }) => ({
          name,
          link: `/search?category=${name}`,
        })),
      ],
    },
    {
      headerName: "About",
      links: [
        { name: "Careers", link: "#" },
        { name: "Press & News", link: "#" },
        { name: "Partnership", link: "#" },
        { name: "Privacy Policy", link: "#" },
        { name: "Terms of Service", link: "#" },
        { name: "Intellectual Property Claims", link: "#" },
        { name: "Investor Relations", link: "#" },
      ],
    },
    {
      headerName: "Support",
      links: [
        { name: "Help & Support", link: "#" },
        { name: "Trust & Safety", link: "#" },
        { name: "Selling on FlexiGigs", link: "#" },
        { name: "Buying on FlexiGigs", link: "#" },
      ],
    },
    {
      headerName: "Community",
      links: [
        { name: "Community Success Stories", link: "#" },
        { name: "Community Hub", link: "#" },
        { name: "Forum", link: "#" },
        { name: "Events", link: "#" },
        { name: "Blog", link: "#" },
        { name: "Influencers", link: "#" },
        { name: "Affiliates", link: "#" },
        { name: "Podcast", link: "#" },
        { name: "Invite a Friend", link: "#" },
        { name: "Become a Seller", link: "#" },
        { name: "Community Standards", link: "#" },
      ],
    },
    {
      headerName: "Move From FlexiGigs",
      links: [
        { name: "FlexiGigs Business", link: "#" },
        { name: "FlexiGigs Pro", link: "#" },
        { name: "FlexiGigs Logo Maker", link: "#" },
        { name: "FlexiGigs Guides", link: "#" },
        { name: "Get Inspired", link: "#" },
        { name: "FlexiGigs Select", link: "#" },
        { name: "ClearVoice", link: "#" },
        { name: "FlexiGigs Workspace", link: "#" },
        { name: "Learn", link: "#" },
        { name: "Working Not Working", link: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full mx-auto px-8 py-16 border-t border-gray-200 bg-gray-100">
      <nav>
        <ul className="flex flex-wrap justify-between">
          {data.map(({ headerName, links }) => (
            <li key={headerName} className="flex flex-col gap-2">
              <span className="font-bold">{headerName}</span>
              <ul className="flex flex-col gap-2">
                {links.map(({ name, link }) => (
                  <li key={name} className="text-[#404145]">
                    <Link href={link}>{name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-12 flex items-center justify-between">
        <FiverrLogo fillColor={"#404145"} />
        <ul className="flex gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li key={name} className="text-xl text-[#404145] hover:text-[#1DBF73] transition-all">
              <Link href={link} aria-label={name} target="_blank" rel="noopener noreferrer">
                {icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
