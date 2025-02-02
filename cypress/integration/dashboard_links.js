context('Dashboard links', () => {
	before(() => {
		cy.visit('/login');
		cy.login();
	});

	it('Adding a new contact, checking for the counter on the dashboard and deleting the created contact', () => {
		cy.visit('/app/contact');
		cy.clear_filters();

		cy.visit('/app/user');
		cy.get('.list-row-col > .level-item > .ellipsis').eq(0).click();

		//To check if initially the dashboard contains only the "Contact" link and there is no counter
		cy.get('[data-doctype="Contact"]').should('contain', 'Contact');

		//Adding a new contact
		cy.get('.btn[data-doctype="Contact"]').click();
		cy.get('[data-doctype="Contact"][data-fieldname="first_name"]').type('Admin');
		cy.findByRole('button', {name: 'Save'}).click();
		cy.visit('/app/user');
		cy.get('.list-row-col > .level-item > .ellipsis').eq(0).click();

		//To check if the counter for contact doc is "1" after adding the contact
		cy.get('[data-doctype="Contact"] > .count').should('contain', '1');
		cy.get('[data-doctype="Contact"]').contains('Contact').click();

		//Deleting the newly created contact
		cy.visit('/app/contact');
		cy.get('.list-subject > .select-like > .list-row-checkbox').eq(0).click();
		cy.findByRole('button', {name: 'Actions'}).click();
		cy.get('.actions-btn-group [data-label="Delete"]').click();
		cy.findByRole('button', {name: 'Yes'}).click({delay: 700});


		//To check if the counter from the "Contact" doc link is removed
		cy.wait(700);
		cy.visit('/app/user');
		cy.get('.list-row-col > .level-item > .ellipsis').eq(0).click();
		cy.get('[data-doctype="Contact"]').should('contain', 'Contact');
	});

	it('Report link in dashboard', () => {
		cy.visit('/app/user');
		cy.visit('/app/user/Administrator');
		cy.get('[data-doctype="Contact"]').should('contain', 'Contact');
		cy.findByText('Connections');
		cy.window()
			.its('cur_frm')
			.then(cur_frm => {
				cur_frm.dashboard.data.reports = [
					{
						'label': 'Reports',
						'items': ['Permitted Documents For User']
					}
				];
				cur_frm.dashboard.render_report_links();
				cy.get('[data-report="Permitted Documents For User"]').contains('Permitted Documents For User').click();
				cy.findByText('Permitted Documents For User');
				cy.findByPlaceholderText('User').should("have.value", "Administrator");
			});
	});
});
