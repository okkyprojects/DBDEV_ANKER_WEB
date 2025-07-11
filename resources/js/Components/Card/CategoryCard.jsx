export default function CategoryCard({ item }) {
    return (
        <div className="bg-white rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
            <img
                src={item.img}
                alt={item.name}
                className="w-10 h-10 sm:w-12 sm:h-12 mb-2 rounded-xl"
            />
            <p className="text-sm sm:text-base text-neutral-800">{item.name}</p>
        </div>
    );
}
