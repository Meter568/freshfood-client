import type { CategoryLite, SubcategoriesProps } from "../types/category"

const Subcategories = ({subcategories, selectedSubSlug, setSelectedSubSlug}: SubcategoriesProps) => {
    return (
        <div className="grid grod-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
            {subcategories.length === 0 ? (
                <p className="mb-31">Поки що не немає</p>
            ) : (
                <>
                    {subcategories
                        .filter((sub) => {
                            if(selectedSubSlug === null) return true
                            return 'slug' in sub && sub.slug === selectedSubSlug
                        })
                        .map((sub) => {
                            const backgroundColor = 'bgColor' in sub && sub.bgColor ? sub.bgColor : undefined
                            const hasLogo = 'logo' in sub && !!sub.logo
                            return (
                            <div
                                key={sub.id}
                                className="group cursor-pointer py-5 px-3 gap-2 rounded-xl flex flex-col justify-center items-center"
                                style={{ backgroundColor }}
                                onClick={() => setSelectedSubSlug('slug' in sub && sub.slug ? sub.slug : null)}
                            >
                                {hasLogo ? (
                                <img
                                    src={`http://localhost:5000${(sub as CategoryLite).logo}`}
                                    alt={sub.name}
                                    className="group-hover:scale-108 transition max-w-28"
                                />
                                ) : null}
                                <p className="text-sm text-center font-medium">{sub.name}</p>
                            </div>
                        )
                    })}
                        {selectedSubSlug && (
                        <div
                            className="group cursor-pointer py-5 px-3 gap-2 rounded-xl flex flex-col justify-center items-center bg-red-600"
                            onClick={() => setSelectedSubSlug(null)}
                        >
                        <p className="text-sm text-center font-medium text-white">Показати всі</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Subcategories
