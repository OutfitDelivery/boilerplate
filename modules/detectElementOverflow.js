const getRect = (element) => element.getBoundingClientRect();

const detectElementOverflow = (element, container) => ({
  get collidedTop() {
    return getRect(element).top < getRect(container).top;
  },
  get collidedBottom() {
    return getRect(element).bottom > getRect(container).bottom;
  },
  get collidedLeft() {
    return getRect(element).left < getRect(container).left;
  },
  get collidedRight() {
    return getRect(element).right > getRect(container).right;
  },
  get collidedY() {
    return this.collidedTop || this.collidedBottom;
  },
  get collidedZ() {
    return this.collidedLeft || this.collidedRight;
  },
  get collidedAny() {
    return this.collidedY || this.collidedZ;
  },
  get overflowTop() {
    return getRect(container).top - getRect(element).top;
  },
  get overflowBottom() {
    return getRect(element).bottom - getRect(container).bottom;
  },
  get overflowLeft() {
    return getRect(container).left - getRect(element).left;
  },
  get overflowRight() {
    return getRect(element).right - getRect(container).right;
  },
});

export default detectElementOverflow;
