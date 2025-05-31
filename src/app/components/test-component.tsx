import { prismabd } from '../../../prisma/prismadb';

export default async function TestComponent() {
  const categories = await prismabd.category.findMany();
  // console.log(categories);

  return (
    <div className=" text-amber-800 ">
      {categories.map((category) => {
        return <div key={category.id}>{category.name}</div>;
      })}
    </div>
  );
}
