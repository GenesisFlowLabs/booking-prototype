"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/booking";
import { packages, featureComparison } from "@/data/packages";
import { PackageCard } from "./PackageCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, LayoutGrid, Table2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PackageTier } from "@/types/booking";

export function PackageStep() {
  const { selectedPackage, setPackage, nextStep, prevStep } = useBookingStore();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          Choose your inspection package
        </h2>
        <p className="text-gray-500 mt-2">
          Every package includes a certified inspector and detailed digital
          report.
        </p>
      </div>

      {/* View toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-gw-green shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-gw-green shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Table2 className="w-4 h-4" />
            Compare
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "cards" ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4"
          >
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                selected={selectedPackage === pkg.id}
                onSelect={(id: PackageTier) => setPackage(id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-heading font-bold text-gray-700">
                    Feature
                  </th>
                  {packages.map((pkg) => (
                    <th
                      key={pkg.id}
                      className={`p-4 text-center ${
                        pkg.popular ? "bg-gw-green/5" : ""
                      }`}
                    >
                      <div className="font-heading font-bold text-gray-900">
                        {pkg.name}
                      </div>
                      <div className="text-sm text-gray-400">Starting at</div>
                      <div className="text-lg font-bold text-gw-green">
                        ${pkg.price.toLocaleString()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, i) => (
                  <tr
                    key={feature.name}
                    className={i % 2 === 0 ? "bg-gray-50/50" : ""}
                  >
                    <td className="p-3 md:p-4 text-sm text-gray-700">
                      {feature.name}
                    </td>
                    {(["green", "greener", "greenest"] as const).map((tier) => (
                      <td
                        key={tier}
                        className={`p-3 md:p-4 text-center ${
                          tier === "greener" ? "bg-gw-green/5" : ""
                        }`}
                      >
                        {feature[tier] ? (
                          <Check className="w-5 h-5 text-gw-green mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-100">
                  <td className="p-4" />
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-center">
                      <button
                        onClick={() => setPackage(pkg.id)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                          selectedPackage === pkg.id
                            ? "bg-gw-green text-white"
                            : "border-2 border-gw-green text-gw-green hover:bg-gw-green hover:text-white"
                        }`}
                      >
                        {selectedPackage === pkg.id ? "Selected" : "Select"}
                      </button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <Button onClick={prevStep} variant="ghost">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!selectedPackage} size="lg">
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
