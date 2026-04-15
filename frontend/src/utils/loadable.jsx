import { Suspense } from "react";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-40">
      <span className="text-gray-500 text-sm">Loading halaman...</span>
    </div>
  );
};

export const Loadable = (Component) => {
  return (props) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};
