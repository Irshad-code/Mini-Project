import { useState } from 'react';
import { FiDollarSign, FiPieChart } from 'react-icons/fi';

export default function TaxCalculator() {
  const [formData, setFormData] = useState({
    basicSalary: '',
    hra: '',
    lta: '',
    otherAllowances: '',
    professionalTax: '',
    standardDeduction: '50000', // Fixed as per rules
    section80C: '',
    section80D: '',
    section80CCD: '',
    section80G: '',
    section80TTA: '',
    homeLoanInterest: '',
    educationLoanInterest: '',
    regime: 'new',
  });

  const [calculatedTax, setCalculatedTax] = useState(null);

  const calculateTax = () => {
    // Convert all values to numbers
    const values = Object.keys(formData).reduce((acc, key) => {
      acc[key] = Number(formData[key]) || 0;
      return acc;
    }, {});

    // Calculate gross salary
    const grossSalary = values.basicSalary + values.hra + values.lta + values.otherAllowances;

    let taxableIncome = grossSalary;
    
    if (formData.regime === 'old') {
      // Deductions for old regime
      const totalDeductions = 
        values.standardDeduction +
        values.section80C +
        values.section80D +
        values.section80CCD +
        values.section80G +
        values.section80TTA +
        values.homeLoanInterest +
        values.educationLoanInterest +
        values.professionalTax;

      taxableIncome -= totalDeductions;
    }

    // Calculate tax based on regime
    let tax = 0;
    if (formData.regime === 'new') {
      // New Tax Regime 2024-25
      if (taxableIncome <= 300000) {
        tax = 0;
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.10;
      } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.20;
      } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.30;
      }
    } else {
      // Old Tax Regime 2024-25
      if (taxableIncome <= 250000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.20;
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.30;
      }
    }

    // Calculate cess
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    setCalculatedTax({
      grossSalary,
      taxableIncome,
      basicTax: tax,
      cess,
      totalTax,
      effectiveRate: ((totalTax / grossSalary) * 100).toFixed(2),
      monthlyTax: (totalTax / 12).toFixed(0),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const InputField = ({ label, name, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">₹</span>
        </div>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FiPieChart className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Income Tax Calculator 2024-25</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Income Details */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Income Details</h3>
            <div className="space-y-4">
              <InputField
                label="Basic Salary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleInputChange}
              />
              <InputField
                label="HRA Received"
                name="hra"
                value={formData.hra}
                onChange={handleInputChange}
              />
              <InputField
                label="LTA Received"
                name="lta"
                value={formData.lta}
                onChange={handleInputChange}
              />
              <InputField
                label="Other Allowances"
                name="otherAllowances"
                value={formData.otherAllowances}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Deductions</h3>
            <div className="space-y-4">
              <InputField
                label="Professional Tax"
                name="professionalTax"
                value={formData.professionalTax}
                onChange={handleInputChange}
              />
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Standard Deduction</label>
                <span className="text-gray-600">₹50,000</span>
              </div>
              {formData.regime === 'old' && (
                <>
                  <InputField
                    label="80C (PF, LIC, etc.)"
                    name="section80C"
                    value={formData.section80C}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="80D (Health Insurance)"
                    name="section80D"
                    value={formData.section80D}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="80CCD (NPS)"
                    name="section80CCD"
                    value={formData.section80CCD}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="80G (Donations)"
                    name="section80G"
                    value={formData.section80G}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="80TTA (Savings Interest)"
                    name="section80TTA"
                    value={formData.section80TTA}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Home Loan Interest"
                    name="homeLoanInterest"
                    value={formData.homeLoanInterest}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Education Loan Interest"
                    name="educationLoanInterest"
                    value={formData.educationLoanInterest}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </div>
          </div>

          {/* Tax Regime Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Select Tax Regime</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="regime"
                  value="new"
                  checked={formData.regime === 'new'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2">New Regime</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="regime"
                  value="old"
                  checked={formData.regime === 'old'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2">Old Regime</span>
              </label>
            </div>
          </div>

          <button
            onClick={calculateTax}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Tax
          </button>
        </div>

        {/* Results */}
        {calculatedTax && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Tax Calculation Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Gross Salary</span>
                  <span className="font-medium">₹{calculatedTax.grossSalary.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-medium">₹{calculatedTax.taxableIncome.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Income Tax</span>
                  <span className="font-medium">₹{calculatedTax.basicTax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Cess (4%)</span>
                  <span className="font-medium">₹{calculatedTax.cess.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded">
                  <span className="font-medium text-blue-800">Total Tax</span>
                  <span className="font-bold text-blue-800">₹{calculatedTax.totalTax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 mt-2">
                  <span className="text-gray-600">Monthly Tax</span>
                  <span className="font-medium text-green-600">₹{calculatedTax.monthlyTax}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Effective Tax Rate</span>
                  <span className="font-medium text-green-600">{calculatedTax.effectiveRate}%</span>
                </div>
              </div>
            </div>

            {/* Tax Saving Tips */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Tax Saving Tips</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Maximize your 80C investments (up to ₹1.5 lakh)</li>
                <li>Consider NPS contributions for additional tax benefits</li>
                <li>Invest in health insurance for yourself and family</li>
                <li>If applicable, claim HRA benefits</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
