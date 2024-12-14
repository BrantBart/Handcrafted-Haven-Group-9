// import Link from "next/link";
// import { fetchHandcraftImages } from "@/app/lib/app";
// import { formatPrice } from "@/app/lib/util";
// import Image from "next/image";

// export default async function GalleryPage() {
//   const images = await fetchHandcraftImages("handcraft");

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-100">
//       {images.map((image) => (
//         <div
//           key={image.id}
//           className="border p-4 h-72 rounded-lg shadow-lg transition-shadow hover:shadow-xl bg-white"
//         >
//           {/* Link to Individual Image Page */}
//           <Link href={`/sellers/${image.id}`}>
//             <div className="relative group h-full">
//               {/* Image */}
//               <Image
//                 src={image.src.small}
//                 alt={image.alt}
//                 className="w-full h-48 object-cover rounded-md cursor-pointer transition-transform duration-300 group-hover:blur-[0.5px]"
//               />
//               {/* Photographer Name */}
//               <div className="mt-4 text-center">
//                 <h3 className="text-lg font-medium">{image.photographer}</h3>
//                 <p className="text-sm text-gray-600">
//                   {formatPrice(20.99)}
//                 </p>{" "}
//                 {/* Mock price */}
//               </div>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }
