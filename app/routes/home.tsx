import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dictionary VCF Generator" },
    { name: "description", content: "Generate VCF files from dictionary for macOS voice input" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Dictionary VCF Generator
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Generate vCard files from technical dictionaries to improve macOS voice input recognition for programming terms.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/dictionaries"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Manage Dictionaries
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Select dictionaries and generate VCF files for import into macOS Contacts</p>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900 mb-1">1. Select</div>
              Choose the dictionaries you need
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">2. Generate</div>
              Create a VCF file with phonetic readings
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">3. Import</div>
              Add to macOS Contacts for voice recognition
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
