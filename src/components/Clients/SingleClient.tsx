import Image from "next/image";
import Link from "next/link";
import { Client } from "@/types/client";
import Logo from "../Common/Logo";

const SingleClient = ({ client }: { client: Client }) => {
  const { title, link, logo, logoWhite } = client;
  return (
    <div className="ud-single-logo mb-5 mr-10 max-w-[140px]">
        <Logo link={link} target="_blank" />
    </div>
  );
};

export default SingleClient;
