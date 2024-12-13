import { fetchHandcraftImages } from "@/app/lib/app";
import { formatPrice } from "@/app/lib/utils";

export default async function ImagePage({ params }: { params: { id: string } }) {

  const images = await fetchHandcraftImages("handcraft");
  
  const image = images.find((img:any) => img.id.toString() === params.id);

  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Image Container */}
        <div className="w-full h-full">
          <img
            src={image.src.large}
            alt={image.alt}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Information Container */}
        <div className="flex flex-col justify-between space-y-4">
          <h2 className="text-2xl font-semibold">{image.photographer}</h2>
          <p className="text-gray-600">{image.alt || "No description available"}</p>
          <p className="text-lg font-bold">Price: {formatPrice(20.99)}</p>
          <p className="text-lg">Ratings: ★★★★☆ (4.5)</p>
          <a
            href="/gallery"
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Back to Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
