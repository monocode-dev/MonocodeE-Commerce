import pool, {Product} from "./migration/database";

export async function findProducts(name?: string) : Promise<Product[]>{
    if(!name){
        const result = await pool.query(
            'SELECT * FROM products',
        )
        return result.rows as Product[]
    }else{
        const result = await pool.query(
            'SELECT * FROM products WHERE name = $1',
            [name]
        )
        return result.rows as Product[] || null
    }
}

export async function addProduct(name: string, price:number, stock?:number, description?:string, image_url?:string): Promise<number> {
    const result = await pool.query(
        'INSERT INTO products (name, description, price, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, description, price, image_url, stock]
    )
    return result.rows[0].id as number
}

export async function editProduct(id: string, name?: string, price?:number, stock?:number, description?:string, image_url?:string): Promise<number | null> {
    const updates: { column: string; value: any }[] = [];
  
    if (name !== undefined) updates.push({ column: 'name', value: name });
    if (description !== undefined) updates.push({ column: 'description', value: description });
    if (price !== undefined) updates.push({ column: 'price', value: price });
    if (image_url !== undefined) updates.push({ column: 'image_url', value: image_url });
    if (stock !== undefined) updates.push({ column: 'stock', value: stock });

    if (updates.length === 0) return 0; 

    const setClause = updates
        .map((update, index) => `${update.column} = $${index + 1}`)
        .join(', ');

    const values = updates.map(update => update.value);
    values.push(id);

    const result = await pool.query(
        `UPDATE products SET ${setClause} WHERE id = $${values.length}`,
        values
    );

    return result.rowCount
}

export async function removeProduct(id: string): Promise<number | null> {
    const result = await pool.query(
        'DELETE FROM products WHERE id = $1',
        [id]
    );

    return result.rowCount
}