const { MessageEmbed } = require('discord.js')


module.exports = class PaginatedArray{
  constructor(array = []){

    if (!Array.isArray(array))
      throw new Error(`PaginatedArray: Supplied arguments is not an array of MessageEmbed.`)

    for (const item of array){
      if (!(item instanceof MessageEmbed))
      throw new Error(`PaginatedArray: Supplied arguments is not a MessageEmbed.`)
    }

    this._array = array;
    this._index = 0;
    this._head = 0;
    this._tail = array.length ? array.length - 1 : null;
  }

  add(item){

    if (!item || typeof item !== 'object')
    throw new Error(`PaginatedArray#add: Expected MessageEmbed. Received ${typeof item}.`)

    if (!(item instanceof MessageEmbed))
    throw new Error(`PaginatedArray#add: Supplied arguments is not a MessageEmbed.`)

    this._array.push(item)
    this._tail = this._array.length - 1
    return this
  }

  next(){
    if (this._index === this._tail) this._index = -1;
    this._index++;
    return this._array[this._index];
  }

  previous(){
    if (this._index === this._head) this._index = this._tail + 1;
    this._index--;
    return this._array[this._index];
  }

  get currentPage(){
    return this._array[this._index];
  }

  get firstPage(){
    return this._array[this._head];
  }

  get lastPage(){
    return this._array[this._tail];
  }

  get currentIndex(){
    return this._index
  }

  get size(){
    return this._tail !== null ? this._tail + 1 : null;
  }
}
