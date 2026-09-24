import { MenuItem } from "./MenuItem";
import { menuData } from "@/data/menu"; // o pasa por props

export function MenuCategory({ category }: { category: typeof menuData[0] }) {
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{category.title}</h2>
        {category.description && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}