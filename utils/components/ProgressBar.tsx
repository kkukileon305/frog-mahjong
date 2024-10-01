type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto border-2 border-white bg-gray-400 rounded-full h-6 overflow-hidden">
      <div
        className="bg-white h-full rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />

      <span className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
        {progress}%
      </span>
    </div>
  );
};

export default ProgressBar;
