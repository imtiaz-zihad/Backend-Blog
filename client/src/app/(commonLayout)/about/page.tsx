export const dynamic = "force-dynamic";

export default async function AboutPage(){

    await new Promise((resolve) => setTimeout(resolve, 3000));

  //  throw new Error("Failed to load the About page.");
    return (
        <div>
            <h1>About Page</h1>
        </div>
    )
}