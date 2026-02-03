import { motion } from "motion/react";

/**
 * Loading skeleton component for the Quick View modal
 * Shows shimmer animation while product data is loading
 */
export function Skeleton() {
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Image Skeleton */}
      <div className="flex-shrink-0 w-full md:w-1/2 bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
          animate={{
            backgroundPosition: ["0%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-6 md:p-8 space-y-6">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <motion.div
            className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>

        {/* Price Skeleton */}
        <motion.div
          className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />

        {/* Options Skeleton */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <motion.div
                className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.1 * i,
                }}
              />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <motion.div
                    key={j}
                    className="h-10 bg-gray-200 dark:bg-gray-800 rounded-full w-20"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.1 * (i + j),
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <motion.div
          className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
      </div>
    </div>
  );
}
