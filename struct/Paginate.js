
module.exports = class PaginatedArray{
  constructor(array){
    this._array = array ? array : [];
    this._index = 0;
    this._head = 0;
    this._tail = array ? array.length - 1 : 0;
  }

  add(item){
    this._array.push(item)
    this._tail = this._array.length
    return this
  }

  next(){
    if (this._index === this._tail - 1) this._index = -1;
    this._index++;
    return this._array[this._index];
  }

  previous(){
    if (this._index === this._head) this._index = this._tail;
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
    return this._tail + 1;
  }
}
