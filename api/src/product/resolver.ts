import { ObjectType, Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { getVisibleproducts } from "../helpers/filter";
import { ProductSortType } from "./enum";
import { CategoryType } from "../category/enum";
import productsData from "./data";
import ProductInput from "./input";
import Product, { PaginatedResponse } from "./";

// we need to create a temporary class for the abstract, generic class "instance"
@ObjectType()
class ProductsResponse extends PaginatedResponse(Product) {
  // you can add more fields here if you need
}

@Resolver()
export class ProductResolver {
  private readonly items: Product[] = productsData();

  @Query({ description: "get all products Data" })
  products(
    @Arg("indexFrom", (type) => Int, { defaultValue: 0 }) indexFrom: number,
    @Arg("limit", (type) => Int, { defaultValue: 10 }) limit: number,
    @Arg("type", (type) => CategoryType, { nullable: true }) type: CategoryType,
    @Arg("text", { nullable: true }) text: string,
    @Arg("brand", (type) => [String], { nullable: true }) brand: string[],
    @Arg("color", { nullable: true }) color: string,
    @Arg("sortBy", (type) => ProductSortType, { nullable: true }) sortBy: ProductSortType,
    @Arg("priceMin", (type) => Int, { defaultValue: 0 }) priceMin: number,
    @Arg("priceMax", (type) => Int, { nullable: true }) priceMax: number,
  ): ProductsResponse {
    const types = type !== "all" ? type : undefined;
    const brands = brand && brand.length > 0 ? brand : undefined;
    const colors = color !== "" ? color : undefined;
    const filterData = getVisibleproducts(this.items, types, text, brands, colors, sortBy, priceMin, priceMax);
    const total = filterData.length;
    return {
      items: filterData.slice(indexFrom, indexFrom + limit),
      hasMore: total > indexFrom + limit,
      total,
    };
  }

  @Query(() => Product, { description: "get product details by ID" })
  async product(@Arg("id", { defaultValue: 0 }) id: number): Promise<Product | undefined> {
    const data = this.items.find((item) => item.id === id);
    return await data;
  }

  @Query(() => [Product], { description: "get related products by Type" })
  async relatedProducts(@Arg("id", (type) => Int) id: number, @Arg("type") type: string): Promise<Product[]> {
    return await this.items.filter((item) => item.type === type && item.id !== id).slice(0, 10);
  }

  @Query(() => [Product], { description: "get new products by Type" })
  async newProducts(@Arg("type", { nullable: true }) type: string): Promise<Product[]> {
    return await this.items
      .filter((item) => {
        var cond: Boolean;
        if (type) cond = item.type === type && item.new === true;
        else cond = item.new === true;

        return cond;
      })
      .slice(0, 10);
  }

  @Query(() => [Product], { description: "get new products by Collection" })
  async collection(@Arg("collec", { nullable: true }) collec: string): Promise<Product[]> {
    return this.items.filter((item) => {
      return item.collection.find((i) => {
        if (i.collectionName === collec) return item;
        return;
      });
    });
  }

  // Mutations
  @Mutation(() => Product, { description: "create product" })
  async createProduct(@Arg("product") product: ProductInput): Promise<Product> {
    return await product;
  }
}
