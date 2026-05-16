export interface TestResult {
  suite: string;
  name: string;
  status: "passed" | "failed";
  error?: string;
  retryCount?: number;
  warnings?: string[];
  issueId?: string;
}

/**
 * Per-run aggregator for an HTML email summary. Specs push warnings via
 * `global.emailReportUtil.addWarningMessage(...)`; onComplete renders the report.
 */
export class EmailReportUtil {
  private warningMessages: Map<string, string[]> = new Map();
  private issueIds: Map<string, string> = new Map();
  private currentTestKey: string | null = null;

  public setCurrentTest(suite: string, testName: string): void {
    this.currentTestKey = this.testKey(suite, testName);
  }

  public addWarningMessage(message: string): void {
    if (!this.currentTestKey) {
      throw new Error(
        "No current test set. Call setCurrentTest() in beforeTest hook first."
      );
    }
    if (!this.warningMessages.has(this.currentTestKey)) {
      this.warningMessages.set(this.currentTestKey, []);
    }
    this.warningMessages.get(this.currentTestKey)!.push(message);
  }

  public getCurrentTestWarnings(suite: string, testName: string): string[] {
    return this.warningMessages.get(this.testKey(suite, testName)) || [];
  }

  public setCurrentTestIssueId(issueId: string): void {
    if (this.currentTestKey) {
      this.issueIds.set(this.currentTestKey, issueId);
    }
  }

  public getCurrentTestIssueId(
    suite: string,
    testName: string
  ): string | undefined {
    return this.issueIds.get(this.testKey(suite, testName));
  }

  public generateEmailReport(
    testResults: TestResult[],
    baseUrl: string
  ): string {
    const enriched = testResults.map((test) => ({
      ...test,
      warnings: [
        ...(test.warnings || []),
        ...(this.warningMessages.get(this.testKey(test.suite, test.name)) || [])
      ]
    }));

    const total = enriched.length;
    const passed = enriched.filter((t) => t.status === "passed").length;
    const failed = enriched.filter((t) => t.status === "failed").length;
    const retried = enriched.filter((t) => (t.retryCount || 0) > 0).length;
    const withWarnings = enriched.filter(
      (t) => t.warnings && t.warnings.length > 0
    ).length;

    const suiteGroups = enriched.reduce(
      (acc, t) => {
        if (!acc[t.suite]) acc[t.suite] = [];
        acc[t.suite].push(t);
        return acc;
      },
      {} as Record<string, typeof enriched>
    );

    const testTableRows = Object.entries(suiteGroups)
      .map(([suite, tests]) => {
        const suiteRow = `<tr><td colspan="3" style="background:#e9ecef;font-weight:bold;padding:8px 12px;">${suite}</td></tr>`;
        const testRows = tests
          .map((t) => {
            const retryInfo =
              (t.retryCount || 0) > 0 ? ` (${t.retryCount} retries)` : "";
            const statusCol =
              t.status === "passed"
                ? '<span style="color:green;">PASS</span>'
                : '<span style="color:red;">FAIL</span>';
            const warningsCol =
              t.warnings && t.warnings.length > 0
                ? `<span style="color:#ff8c00;">${t.warnings.length} warning(s)</span><br/><small>${t.warnings.join("<br/>")}</small>`
                : "-";
            return `<tr><td style="padding-left:20px;">${t.name}${retryInfo}</td><td>${statusCol}</td><td>${warningsCol}</td></tr>`;
          })
          .join("");
        return suiteRow + testRows;
      })
      .join("");

    return `
      <html><body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:20px;">
        <div style="background:white;padding:20px;border-radius:8px;">
          <h2>Test Report Summary</h2>
          <div style="background:#e9ecef;padding:15px;border-radius:5px;margin-bottom:20px;">
            <p><strong>Total:</strong> ${total}</p>
            <p><strong>Passed:</strong> <span style="color:green;">${passed}</span></p>
            <p><strong>Failed:</strong> <span style="color:red;">${failed}</span></p>
            ${retried > 0 ? `<p><strong>Retried:</strong> ${retried}</p>` : ""}
            ${withWarnings > 0 ? `<p><strong>With Warnings:</strong> ${withWarnings}</p>` : ""}
            <p><strong>Allure Report:</strong> <a href="${baseUrl}">${baseUrl}</a></p>
          </div>
          <h3>All Tests</h3>
          <table style="border-collapse:collapse;width:100%;">
            <tr><th style="background:#f8f9fa;padding:8px;border:1px solid #dee2e6;">Test</th><th style="background:#f8f9fa;padding:8px;border:1px solid #dee2e6;">Status</th><th style="background:#f8f9fa;padding:8px;border:1px solid #dee2e6;">Warnings</th></tr>
            ${testTableRows}
          </table>
        </div>
      </body></html>
    `;
  }

  public generateEmailSubject(
    testResults: TestResult[],
    suiteName: string
  ): string {
    const total = testResults.length;
    const passed = testResults.filter((t) => t.status === "passed").length;
    const failed = testResults.filter((t) => t.status === "failed").length;
    const status = failed === 0 ? "PASS" : "FAIL";
    const failedText = failed > 0 ? ` (${failed} failed)` : "";
    return `[${status}] E2E Demo - [${suiteName}]: ${passed}/${total} Passed${failedText} - ${new Date().toLocaleDateString()}`;
  }

  private testKey(suite: string, testName: string): string {
    return `${suite}::${testName}`;
  }
}
