import * as React from "react";
import Layout from "../components/layout.js";
import { getVideoScript } from "lib/config.js";

export async function getStaticProps() {
  const script = await getVideoScript("武松打虎");
  return {
    props: { script },
  };
}

export default function Home({ script }) {
  const scenarios = script.script["场景"]
  console.log("index", scenarios)
  return <Layout scenarios={scenarios}></Layout>;
}
