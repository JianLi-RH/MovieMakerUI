import { getAllHelpIds, getPostData } from "lib/help";

export default function Help({ helpData }) {
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
