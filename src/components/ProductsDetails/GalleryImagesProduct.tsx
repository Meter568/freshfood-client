import type { GalleryImagesProductProps } from "../../types/product"

const GalleryImagesProduct = ({images, thumbnail, setThumbnail, count}: GalleryImagesProductProps) => {
    return (
        <>
            {/* Список мініатюр зліва - тільки на XL+ */}
            <div className="hidden xl:flex flex-col gap-3">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setThumbnail(image)}
                            className={
                                "border w-32 h-32 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all duration-200 " +
                                (thumbnail === image
                                    ? "border-2 border-primary ring-2 ring-primary"
                                    : "border-gray-500/30 hover:scale-105 hover:shadow-lg")
                            }
                            style={{ boxSizing: "border-box" }}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="p-3 transition-all duration-200"
                                style={{
                                    opacity: thumbnail === image ? 1 : 0.7,
                                    filter: thumbnail === image ? "none" : "grayscale(30%)",
                                }}
                            />
                        </div>
                    ))}
                </div>
                {/* велика картина */}
                <div className={`border-2 ${count > 0 ? "border-primary" : "border-gray-500/30"} w-full xl:max-w-xl rounded-xl overflow-hidden p-5 xl:p-11 bg-white flex flex-col items-center justify-center`}>
                    <img
                        src={thumbnail || images[0]}
                        alt="Selected product"
                        className="w-[450px] max-w-full"
                    />
                    {/* Горизонтальний список мініатюр знизу для <XL */}
                    <div className="flex xl:hidden flex-row gap-3 mt-4 justify-center">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className={
                                    "border w-16 h-16 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all duration-200 " +
                                    (thumbnail === image
                                        ? "border-2 border-primary ring-2 ring-primary"
                                        : "border-gray-500/30 hover:scale-105 hover:shadow-lg")
                                }
                                style={{ boxSizing: "border-box" }}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="p-2 transition-all duration-200"
                                    style={{
                                        opacity: thumbnail === image ? 1 : 0.7,
                                        filter: thumbnail === image ? "none" : "grayscale(30%)",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
        </>
    )
}

export default GalleryImagesProduct
