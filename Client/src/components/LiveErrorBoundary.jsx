import { Component } from "react";

export default class LiveErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Custom component crashed:", error?.message);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full min-h-[60px] w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2 text-center text-[10px] font-medium text-red-500">
          This component crashed while rendering
        </div>
      );
    }
    return this.props.children;
  }
}
