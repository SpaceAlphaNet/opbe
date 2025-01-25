
/**
 * Defense
 * conversion from php to ts done by scisneromam
 */
class Type
{
    private id;
    private count;

    public constructor(id: number, count: number)
    {
        this.id = id;
        this.count = count;
    }
    public getId(): number
    {
        return this.id;
    }
    public getCount(): number
    {
        return this.count;
    }
    public getTotalCount(): number
    {
        return this.count;
    }
    public increment(number: number)
    {
        this.count += number;
    }
    public decrement(number: number)
    {
        this.count -= number;
    }
    public setCount(number: number)
    {
        this.count = number;
    }
    /*
    public __toString()
    {
        ob_start();
        _type = this;
        require(OPBEPATH."views/type.html");
        return ob_get_clean();
    }
        */
    public isEmpty(): boolean
    {
        return this.count == 0;
    }
    
    public cloneMe(): Type
    {
        return new Type(this.id,this.count);
    }
}

export {Type}