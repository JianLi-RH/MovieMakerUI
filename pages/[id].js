import { getAllHelpIds, getPostData } from "lib/help";

export default function Help({ helpData }) {
    console.log("helpData: ", helpData)
  return (
    <div className="md:container md:mx-auto">
      <article>
        <main dangerouslySetInnerHTML={{ __html: helpData.contentHtml }} />
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllHelpIds();
  console.log(paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const helpData = await getPostData(params.id);
  return {
    props: {
      helpData,
    },
  };
}
