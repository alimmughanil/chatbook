import HomeLayout from "@/Layouts/HomeLayout";

function About(props) {
  const { aboutText } = props
  return (
    <HomeLayout title={props.title} auth={props.auth}>
      <div className="grid w-full md:place-content-center">
        <div className="w-full min-h-[70vh] xl:min-h-[50vh] sm:w-[50vw] bg-white border px-4 rounded-lg shadow py-4 mt-4 mb-16">
          <h1 className="text-lg font-bold text-center">{props.title}</h1>
          <div className="grid gap-2 mt-2">
            <div dangerouslySetInnerHTML={{ __html: aboutText }} className="w-full"></div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default About;
