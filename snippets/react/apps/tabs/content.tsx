export const LongContent = () => (
  <>
    <h2>Getting started</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
      erat a ante venenatis dapibus posuere velit aliquet. Cras mattis
      consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus
      auctor fringilla.
    </p>
    <p>
      Vestibulum id ligula porta felis euismod semper. Maecenas sed diam eget
      risus varius blandit sit amet non magna. Nullam quis risus eget urna
      mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur.
    </p>
    <p>
      Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis
      euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
    </p>
    <p>
      Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh,
      ut fermentum massa justo sit amet risus. Duis mollis, est non commodo
      luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
    </p>
    <p>
      Sed posuere consectetur est at lobortis. Nulla vitae elit libero, a
      pharetra augue. Donec sed odio dui. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <p>
      Maecenas faucibus mollis interdum. Etiam porta sem malesuada magna mollis
      euismod. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
      auctor. Integer posuere erat a ante venenatis dapibus.
    </p>
  </>
);

export const MediumContent = () => (
  <>
    <h2>Overview</h2>
    <p>
      Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh
      ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis
      euismod.
    </p>
    <ul>
      <li>Lightweight and dependency-free</li>
      <li>Accessible by default</li>
      <li>Works with any content</li>
    </ul>
  </>
);

export const RichContent = () => (
  <>
    <h2>Documentation</h2>
    <p>
      A kitchen-sink panel with <strong>bold</strong>, <em>italic</em>,{" "}
      <code>inline code</code>, <mark>highlighted</mark> text and a{" "}
      <a href="#">link</a>.
    </p>

    <h3>Installation</h3>
    <pre>
      <code>{`pnpm add @toolkit/tabs

import { Tabs, Tab } from "@toolkit/tabs";`}</code>
    </pre>

    <h3>Steps</h3>
    <ol>
      <li>Install the package</li>
      <li>
        Wrap your content in <code>&lt;Tabs&gt;</code>
        <ul>
          <li>
            Each section is a <code>&lt;Tab&gt;</code>
          </li>
          <li>
            Give every tab a unique <code>name</code>
          </li>
        </ul>
      </li>
      <li>Optionally set a default tab</li>
    </ol>

    <blockquote>
      <p>Simplicity is prerequisite for reliability.</p>
      <footer>— Edsger W. Dijkstra</footer>
    </blockquote>

    <h3>Props</h3>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>defaultTab</code>
          </td>
          <td>
            <code>string</code>
          </td>
          <td>first tab</td>
          <td>Tab that is active on mount</td>
        </tr>
        <tr>
          <td>
            <code>name</code>
          </td>
          <td>
            <code>string</code>
          </td>
          <td>—</td>
          <td>Unique tab identifier and label</td>
        </tr>
        <tr>
          <td>
            <code>children</code>
          </td>
          <td>
            <code>ReactNode</code>
          </td>
          <td>—</td>
          <td>Panel content</td>
        </tr>
      </tbody>
    </table>

    <h3>Glossary</h3>
    <dl>
      <dt>Tab list</dt>
      <dd>The row of buttons used to switch panels.</dd>
      <dt>Tab panel</dt>
      <dd>The region that shows the content of the active tab.</dd>
    </dl>

    <details>
      <summary>FAQ: Can tabs contain other tabs?</summary>
      <p>Yes, nested tabs work because every instance has its own ids.</p>
    </details>

    <figure>
      <svg
        width="240"
        height="80"
        viewBox="0 0 240 80"
        role="img"
        aria-label="Diagram"
      >
        <rect
          x="0"
          y="0"
          width="70"
          height="24"
          rx="4"
          fill="currentColor"
          opacity="0.8"
        />
        <rect
          x="80"
          y="0"
          width="70"
          height="24"
          rx="4"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="160"
          y="0"
          width="70"
          height="24"
          rx="4"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="0"
          y="32"
          width="230"
          height="48"
          rx="4"
          fill="none"
          stroke="currentColor"
        />
      </svg>
      <figcaption>Tab list above a single panel</figcaption>
    </figure>

    <h3>Feedback</h3>
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Email <input type="email" placeholder="you@example.com" />
      </label>
      <label>
        Rating{" "}
        <select defaultValue="5">
          <option value="5">Excellent</option>
          <option value="3">Okay</option>
          <option value="1">Poor</option>
        </select>
      </label>
      <label>
        <input type="checkbox" /> Subscribe to updates
      </label>
      <textarea rows={3} placeholder="Your message" />
      <button type="submit">Send</button>
    </form>

    <hr />
    <p>
      <small>Last updated: 23 October 2026 · Version 1.0.0</small>
    </p>
  </>
);
