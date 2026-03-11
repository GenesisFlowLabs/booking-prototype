"use client";

import { useBookingStore } from "@/store/booking";
import { getAgentBySlug } from "@/data/agents";
import { UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AgentBanner() {
  const schedulerId = useBookingStore((s) => s.schedulerId);
  const agent = schedulerId ? getAgentBySlug(schedulerId) : undefined;

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto px-4 mb-4"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gw-green/5 border border-gw-green/15">
            <UserCheck className="w-4 h-4 text-gw-green flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Referred by{" "}
              <span className="font-semibold text-gray-900">{agent.name}</span>
              <span className="text-gray-400 mx-1">&mdash;</span>
              <span className="text-gray-500">{agent.company}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
