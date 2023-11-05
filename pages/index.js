import * as React from "react";
import { useState } from "react";

import Layout from "../components/layout.js";
import { getVideoScript } from "lib/config.js";

export async function getStaticProps() {
  const origin_script = await getVideoScript("武松打虎");
  return {
    props: { origin_script },
  };
}

export default function Home({ origin_script }) {
  const [script, setScript] = useState(origin_script.script["场景"]);
  console.log("index", script);
  return <Layout scenarios={script}></Layout>;
}
