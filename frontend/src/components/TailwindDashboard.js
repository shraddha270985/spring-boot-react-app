import React from "react";
import {
  TailwindCard,
  TailwindButton,
  TailwindInput,
  TailwindBadge,
  TailwindAlert,
  TailwindSpinner,
} from "./TailwindComponents";

/**
 * Example Dashboard using Tailwind CSS
 * Shows how to use Tailwind components for new features
 */
export default function TailwindDashboard() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAction = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tailwind Dashboard
          </h1>
          <p className="text-gray-600">
            Modern UI components using Tailwind CSS
          </p>
        </div>

        {/* Alert Example */}
        <div className="mb-6">
          <TailwindAlert variant="info">
            You can now use both Bootstrap and Tailwind components in your
            project!
          </TailwindAlert>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <TailwindCard title="Users">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="text-2xl font-bold text-blue-600">1,234</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </TailwindCard>

          {/* Card 2 */}
          <TailwindCard title="Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active</span>
                <TailwindBadge status="ACTIVE" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Inactive</span>
                <TailwindBadge status="INACTIVE" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <TailwindBadge status="PENDING" />
              </div>
            </div>
          </TailwindCard>

          {/* Card 3 */}
          <TailwindCard title="Performance">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Load Time
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    234ms
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </TailwindCard>
        </div>

        {/* Form Example */}
        <TailwindCard title="Contact Form" className="mb-8 max-w-md">
          <div className="space-y-4">
            <TailwindInput label="Full Name" placeholder="John Doe" />
            <TailwindInput
              label="Email"
              type="email"
              placeholder="john@example.com"
            />
            <TailwindInput
              label="Message"
              placeholder="Your message"
              error="This field is required"
            />
            <div className="flex gap-3">
              <TailwindButton
                variant="primary"
                onClick={handleAction}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </TailwindButton>
              <TailwindButton variant="secondary">Cancel</TailwindButton>
            </div>
          </div>
        </TailwindCard>

        {/* Loading Example */}
        {isLoading && (
          <TailwindCard className="max-w-md">
            <div className="text-center">
              <TailwindSpinner size="lg" className="mb-4" />
              <p className="text-gray-600">Processing your request...</p>
            </div>
          </TailwindCard>
        )}

        {/* Features Table */}
        <TailwindCard title="Features Comparison" className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Bootstrap
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Tailwind
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">Bundle Size</td>
                  <td className="px-4 py-3 text-center">
                    <TailwindBadge status="PENDING" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TailwindBadge status="ACTIVE" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">Customization</td>
                  <td className="px-4 py-3 text-center">
                    <TailwindBadge status="INACTIVE" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TailwindBadge status="ACTIVE" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">Learning Curve</td>
                  <td className="px-4 py-3 text-center">
                    <TailwindBadge status="ACTIVE" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TailwindBadge status="PENDING" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TailwindCard>
      </div>
    </div>
  );
}
