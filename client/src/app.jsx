import { Core } from "utiliti-js";
import { createData, If } from "brace-js";
import Header from './components/Header';
import Footer from './components/Footer';
import Hero, { CTA } from './components/Hero';
import { ImageList } from './components/ImageList';
const http = new Core.Http();
const prediction$ = createData(null);
const error$ = createData(false);
const isPending$ = createData(false);
const toggle$ = createData(true);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const handleImageFetch = async (e) => {
  e.preventDefault();
  isPending$.set(true);
  const response = await http.post(
    "/api/predictions",
    { prompt: e.target.prompt.value },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  let prediction = await response.json();
  if (response.status !== 201) {
    isPending$.set(false)
    error$.set(true);
    return;
  }
  prediction$.set(prediction);

  while (
    prediction$().status !== "succeeded" &&
    prediction$().status !== "failed" && prediction$()?.code !== 'TIME_LIMIT'
  ) {
    await sleep(1000);
    const response = await http.get(
      "/api/predictions/" + prediction$().id
    );
   const prediction = await response.json();
    if (response.status > 300) {
      isPending$.set$(false)
      error$.set(true);
      return;
    }
    isPending$.set(false)
    prediction$.set(prediction);
  }
};

function Image(props) {
  return (
    <div className="w-full h-auto p-2 md:p-4">
      <img
        src={typeof prediction$() !== 'string' ? '' : prediction$()}
        alt="output"
        className="w-full h-auto rounded-lg border-2 border-gray-300"
      />
    </div>
  );
}

function Fallback() {
  return (
    <div className="w-full h-auto p-2 md:p-4">
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-lg font-bold
        text-gray-600">{prediction$()?.code == 'TIME_LIMIT' ? 'API TIMED OUT' : isPending$()
        ?
        'Loading...': Boolean(error$()) ? 'Something went wrong' : 'Image output here'}</p>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="bg-gradient-to-br from-blue-800 to-blue-900 text-white
    pt-5 pb-16">
      <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mt-3 mb-5">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-white rounded-full flex items-center
            justify-center text-blue-900 font-bold text-xl">1</div>
            <div className="ml-6 w-72">
              <h3 className="text-xl font-bold mb-2">AI-powered Image Creation</h3>
              <p>Create stunning images using advanced AI algorithms that translate text descriptions into high-quality images.</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">2</div>
            <div className="ml-6 w-72">
              <h3 className="text-xl font-bold mb-2">Customizable Image Creation</h3>
              <p>Control various aspects of the image generation process, including background, object placement, and more, to create images that perfectly match your needs.</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">3</div>
            <div className="ml-6 w-72">
              <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
              <p>Integrate with your existing workflows and platforms seamlessly using our API or web-based application.</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">4</div>
            <div className="ml-6 w-72">
              <h3 className="text-xl font-bold mb-2">Affordable Pricing</h3>
              <p>Access our powerful image creation tools at a fraction of the cost of hiring a professional graphic designer or illustrator.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Playground({toggle}) {
  return (
   <div className="container mx-auto px-4">
   <div className="border rounded-lg mt-8 mb-8 sm:mt-16 sm:mb-16 md:mt-24
   md:mb-24 lg:mt-32 lg:mb-32 xl:mt-40 xl:mb-40 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl
      font-bold text-center py-8 bg-gradient-to-br
      from-blue-500 via-blue-800 to-blue-500 text-transparent bg-clip-text m-auto">Try Our Stable Diffusion Model Now!</h1>
    </div>
    <p className="text-lg mt-8 mb-4">
      Dream something with{' '}
      <a
        href="#"
        className="underline"
      >
        sixth-dimension/stable-diffusion
      </a>
      :
    </p>

    <form on:submit={handleImageFetch} className="mb-8" key="fetch">
      <input
        type="text"
        name="prompt"
        placeholder="Enter a prompt to display an image"
        className="border border-gray-300 rounded py-2 px-4 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
        rounded mt-4 mr-3">
        Go!
      </button>
      <button
        type="button"
        className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4
        rounded mt-4" on:click={() => toggle.update(show => !show)}>
        Previously Genrated
      </button>
    </form>

    <div>
      <If
        eval={!!prediction$().output}
        fallback={<Fallback />}
      >
        <Image />
      </If>
      <p className={`text-lg font-bold uppercase inline-block py-2 px-4 rounded
      mt-4 ${prediction$()?.code === 'TIME_LIMIT' ? 'bg-red-600 text-white' : prediction$().status == 'starting' ? 'bg-yellow-500 text-white' :
      prediction$().status == 'processing' ? 'bg-blue-500 text-white' :
      prediction$().status == 'succeeded' ? 'bg-green-500 text-white' :
      'bg-gray-500 text-gray-800'}`}>
Status: { prediction$().code ? 'Unavailable' : prediction$().status || 'idle'}
</p>

    </div>
  </div>
    )
}

function App() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <Header key={Symbol('header')} />
      <Hero key={Symbol('hero')} />
      <Features />
     <If eval={toggle$()} else={<ImageList toggle={toggle$} />}>
        <Playground toggle={toggle$}/>
     </If>
      <CTA />
      <Footer />
    </main>
  );
}

export default App;
