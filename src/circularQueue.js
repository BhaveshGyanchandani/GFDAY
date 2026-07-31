// A minimal circular queue: given the current pointer and the list length,
// next()/prev() both wrap around — going back from slide 0 lands on the
// last slide, and (if you ever expose it) going forward from the last
// slide would land back on slide 0.
//
// It's kept as pure functions of (pointer, length) rather than holding its
// own internal pointer, since React state should be the single source of
// truth for "where we are" — this class is just the wrap-around math.

class CircularQueue {
  constructor(items = []) {
    this.items = items;
  }

  get size() {
    return this.items.length;
  }

  get(pointer) {
    return this.items[pointer];
  }

  next(pointer) {
    return (pointer + 1) % this.items.length;
  }

  prev(pointer) {
    return (pointer - 1 + this.items.length) % this.items.length;
  }
}

export default CircularQueue;
