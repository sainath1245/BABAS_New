//
//  AppDelegate.swift
//  BABAS
//
//  Created by sainath.gourishetty on 23/08/25.
//

import UIKit
import Firebase
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {

  override func application(_ application: UIApplication,
                            didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    // Configure Firebase if not already configured
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    self.moduleName = "BABAS"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Provide the bundle URL for the bridge
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  // Reset badge count when entering background
  override func applicationDidEnterBackground(_ application: UIApplication) {
    UIApplication.shared.applicationIconBadgeNumber = 0
  }

  // Handle remote notification and update badge count
  override func application(_ application: UIApplication,
                            didReceiveRemoteNotification userInfo: [AnyHashable : Any],
                            fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    if UIApplication.shared.applicationIconBadgeNumber > 0 {
      UIApplication.shared.applicationIconBadgeNumber += 1
    } else {
      UIApplication.shared.applicationIconBadgeNumber = 1
    }
  }
}
