import { Component, ReactNode } from "react";
import { createPortal } from "react-dom"

export class Sidebar extends Component<any> {
  el?: HTMLElement
  target?: HTMLElement | null
  mounted = false

  constructor(props: any) {
    super(props)
    this.el = document.createElement('div')
  }

  findTarget() {
    if (!this.target) {
      this.target = document.querySelector('.lsf-panel__content .lsf-details')
    }
  }

  mountToTarget() {
    if (this.mounted || !this.el) return

    this.findTarget()

    if (this.target) {
      this.target.appendChild(this.el);
    }
  }

  unmountFromTarget() {
    if (this.target && this.el) {
      this.target.removeChild(this.el);
    }
  }

  componentWillUnmount() {
    this.unmountFromTarget()
  }

  render(): ReactNode {
    this.mountToTarget();

    return createPortal(this.props.children, this.el as HTMLElement)
  }
}
